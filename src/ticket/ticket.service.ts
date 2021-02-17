import { BadRequestException, Injectable } from "@nestjs/common";
import { Ticket } from "./ticket.entity";
import { Product } from "../product/product.entity";
import { TicketRepository } from "./ticket.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "../product/product.repository";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketRepository)
    private ticketRepository: TicketRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    ) {}

  processTicket(ticketString: string, rawProducts: string): Ticket {
    let returnedTicket: Ticket = this.addTicketAttributesIntoTicket(ticketString, rawProducts);
    this.ticketRepository.save(returnedTicket);
    return returnedTicket;
  }

  addTicketAttributesIntoTicket(ticketString: string, rawProducts: string): Ticket {
    // Split de la partie ticket pour récupérer chaque ligne du ticket dans un tableau
    let ticketAttributes: string[] = ticketString.split("\r\n");

    let order: number;
    let vat: number;
    let total: number;

    // Pour chaque ligne contenu dans le tableau d'attributs
    for(let line of ticketAttributes) {
      // Split de la ligne pour dissocier la clé de la valeur
      let attributeLine: string[] = line.split(": ");
      // Si la clé n'est pas l'une attendue ou si la valeur n'est pas un nombre, on retourne une exception
      if((attributeLine[0].toLowerCase() != 'order' && attributeLine[0].toLowerCase() != 'vat' && attributeLine[0].toLowerCase() != 'total') || isNaN(Number(attributeLine[1]))) {
        throw new BadRequestException();
      }
      // Selon la valeur de la clé, on attribue la bonne valeur à la bonne variable
      switch (attributeLine[0].toLowerCase()) {
        case "order": {
          order = Number(attributeLine[1]);
          break;
        }
        case "vat": {
          vat = Number(attributeLine[1]);
          break;

        }
        case "total": {
          total = Number(attributeLine[1]);
          break;
        }
      }
    }
    let products: Product[] = this.parseProductsIntoAnArray(rawProducts)
    return new Ticket(order, vat, total, products);
  }

  parseProductsIntoAnArray(rawProducts: string): Product[] {
    // Tableau de produits à retourner
    let returnedProductsArray: Product[] = [];

    // Split de la partie produits pour récupérer chaque ligne de produit dans un tableau
    let ticketProductLines: string[] = rawProducts.split("\r\n");

    // On split le premier élément du tableau de produits qui contient les entêtes
    // pour les récupérer dans un tableau
    let productsHeaders: string[] = ticketProductLines[0].split(",");

    for(let header of productsHeaders) {
      if(header.toLowerCase() != 'product' && header.toLowerCase() != 'product_id' && header.toLowerCase() != 'price') {
        throw new BadRequestException();
      }
    }

    // Pour chaque ligne de produit, entête exclu
    for (let i: number = 1; i < ticketProductLines.length; i++) {
      let product: string;
      let product_id: string;
      let price: number;

      // On split la ligne pour récupérer chaque valeur dans un tableau
      let lineProductElements: string[] = ticketProductLines[i].split(",");

      // Pour chaque valeur splittée de la ligne
      for (let j: number = 0; j < lineProductElements.length; j++) {
        // Selon la valeur de l'entête avec le même index, on attribue la bonne valeur à la bonne variable
        switch (productsHeaders[j].toLowerCase()) {
          case "product": {
            if(lineProductElements[j] == "") {
              throw new BadRequestException();
            }
            product = lineProductElements[j];
            break;
          }
          case "product_id": {
            if(lineProductElements[j] == "") {
              throw new BadRequestException();
            }
            product_id = lineProductElements[j];
            break;
          }
          case "price": {
            if(isNaN(Number(lineProductElements[j]))) {
              throw new BadRequestException();
            }
            price = Number(lineProductElements[j]);
            break;
          }
        }
      }

      // Création du produit
      let productToInsert: Product = new Product(product_id, product, price);
      // Ajout dans le tableau à retourner
      returnedProductsArray.push(productToInsert);
    }
    return returnedProductsArray;
  }
}

