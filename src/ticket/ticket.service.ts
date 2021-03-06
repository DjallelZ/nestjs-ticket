import { BadRequestException, Injectable } from "@nestjs/common";
import { Ticket } from "./ticket.entity";
import { Product } from "../product/product.entity";
import { TicketRepository } from "./ticket.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRepository } from "../product/product.repository";
import { RawTicket } from "../raw-ticket/raw-ticket.entity";
import { RawTicketRepository } from "../raw-ticket/raw-ticket.repository";

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(TicketRepository)
    private ticketRepository: TicketRepository,
    @InjectRepository(ProductRepository)
    private productRepository: ProductRepository,
    @InjectRepository(RawTicketRepository)
    private rawTicketRepository: RawTicketRepository,
    ) {}

  /**
   * Procède au traitement du ticket
   * @param ticketString - Ticket reçu au travers de la requête sous forme de chaînes de caractères
   * @returns - retourne le ticket enrichi de ses attributs et d'un tableau de produits
   */
  processTicket(ticketString: string): Ticket {

    const ticketParts: string[] = ticketString.split('\r\n\r\n');
    
    const ticketAttributes: string = ticketParts[0];

    const ticketProducts: string = ticketParts[1];

    const returnedTicket: Ticket = this.addTicketAttributesIntoTicket(ticketAttributes, ticketProducts);
    this.ticketRepository.save(returnedTicket);
    return returnedTicket;
  }

  /**
   * Procède à la création d'une instance RawTicket et de son insertion en BDD
   * lorsque le ticket initial est dans un format incorrect
   * @param ticket - Contenu du ticket émis par le client
   * @returns - Objet RawTicket créé
   */
  processRawTicket(ticket: string) {
    const rawTicket: RawTicket = new RawTicket(ticket);
    this.rawTicketRepository.save(rawTicket);
    return rawTicket;
  }

  /**
   * Crée puis retourne l'objet Ticket à partir des chaînes de caractères fournies
   * @param ticketString - Partie "attributs" du ticket (e.g., order, vat, total)
   * @param rawProducts - Partie "produits" du ticket (lignes d'entête + produits)
   * @returns - retourne le ticket enrichi de ses attributs et d'un tableau de produits
   */
  addTicketAttributesIntoTicket(ticketString: string, rawProducts: string): Ticket {
    // Split de la partie ticket pour récupérer chaque ligne du ticket dans un tableau
    const ticketAttributes: string[] = ticketString.split("\r\n");

    let order: number;
    let vat: number;
    let total: number;

    // Pour chaque ligne contenu dans le tableau d'attributs
    for(let line of ticketAttributes) {
      // Split de la ligne pour dissocier la clé de la valeur
      const attributeLine: string[] = line.split(": ");

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
    const products: Product[] = this.parseProductsIntoAnArray(rawProducts)
    return new Ticket(order, vat, total, products);
  }

  /**
   * Parse la chaîne de caractères pour créer  des objets Product et les retourner sous forme de tableau
   * @param rawProducts - Partie "produits" du ticket (lignes d'entête + liste de produits)
   * @returns - retourne un tableau de produits
   */
  parseProductsIntoAnArray(rawProducts: string): Product[] {
    let returnedProductsArray: Product[] = [];

    // Split de la partie produits pour récupérer chaque ligne de produit dans un tableau
    const ticketProductLines: string[] = rawProducts.split("\r\n");

    // On split le premier élément du tableau de produits qui contient les entêtes
    // pour les récupérer dans un tableau
    const productsHeaders: string[] = ticketProductLines[0].split(",");

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
      const lineProductElements: string[] = ticketProductLines[i].split(",");

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

      const productToInsert: Product = new Product(product_id, product, price);
      returnedProductsArray.push(productToInsert);
    }
    return returnedProductsArray;
  }
}

