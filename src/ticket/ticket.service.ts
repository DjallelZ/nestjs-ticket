import { Injectable } from '@nestjs/common';
import { Ticket } from "./ticket.entity";
import { Product } from "./product.entity";

@Injectable()
export class TicketService {

    // Split le payload brut en deux parties puis initialise la création de l'objet Ticket par la suite
    processTicketInsertion(ticketString: string): Ticket {
    // Split de la partie ticket pour récupérer chaque ligne du ticket dans un tableau
    let ticketAttributes: string[] = ticketString.split('\r\n');
    // Ajout des attributs dans un ticket et récupération de celui-ci
    let returnedTicket: Ticket = this.addTicketAttributesIntoTicket(ticketAttributes);
    return returnedTicket;
  }

  addTicketAttributesIntoTicket(ticketAttributes: string[]): Ticket {
    let order: number;
    let vat: number;
    let total: number;
    // Pour chaque ligne contenu dans le tableau d'attributs
    for (let i: number = 0; i < ticketAttributes.length; i++) {
      // Split de la ligne pour dissocier la clé de la valeur
      let attributeLine: string[] = ticketAttributes[i].split(': ');
      // Selon la valeur de la clé, on attribue la bonne valeur à la bonne variable
      switch (attributeLine[0]) {
        case 'Order': {
          order = Number(attributeLine[1]);
          break;
        }
        case 'VAT': {
          vat = Number(attributeLine[1]);
          break;
        }
        case 'Total': {
          total = Number(attributeLine[1]);
          break;
        }
      }
    }

    let returnedTicket: Ticket = new Ticket(order, vat, total);
    return returnedTicket;
  }

  processProductsInsertion(rawProducts: string): Product[] {
    let returnedProductsArray: Product[];
    // Split de la partie produits pour récupérer chaque ligne de produit dans un tableau
    let ticketProducts: string[] = rawProducts.split('\r\n');
    // Ajout des produits dans un tableau et récupération de celui-ci
    returnedProductsArray = this.parseProductsIntoAnArray(ticketProducts);
    return returnedProductsArray;
  }

  parseProductsIntoAnArray(rawProducts: string[]): Product[] {
    let productsArray: Product[] = [];
    // On split le premier élément du tableau de produits qui contient les entêtes
    // pour récupérer chaque entête dans un tableau
    let productsHeaders: string[] = rawProducts[0].split(',');
    // Pour chaque ligne de produit, entête exclu
    for (let i: number = 1; i < rawProducts.length; i++) {
      let product: string;
      let product_id: string;
      let price: number;

      // On split la ligne pour récupérer chaque valeur dans un tableau
      let lineProductElements: string[] = rawProducts[i].split(',');

      // Pour chaque valeur splittée de la ligne
      for(let j: number = 0; j < lineProductElements.length; j++)
      {
        // Selon la valeur de l'entête avec le même index, on attribue la bonne valeur à la bonne variable
        switch (productsHeaders[j]) {
          case 'product': {
            product = lineProductElements[j];
            break;
          }
          case 'product_id': {
            product_id = lineProductElements[j];
            break;
          }
          case 'price': {
            price = Number(lineProductElements[j]);
            break;
          }
        }
      }

      let productToInsert: Product = new Product(product_id, product, price);
      productsArray.push(productToInsert);
    }
    return productsArray;
  }
}
