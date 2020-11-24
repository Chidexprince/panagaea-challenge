import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import gql from 'graphql-tag';

interface Product {
  id: number;
  title: string;
  image_url: string;
  price: number;
  product_options: ProductOption;
}

interface ProductOption{
  title: string;
  prefix: string;
  suffix: string;
  options: ProductOptionValue;
}

interface ProductOptionValue{
  id: number;
  value: string;
}

interface Response{
  products: Product[];
}

const GET_PRODUCTS = gql`
query Products{
  products{
     id
     title
     image_url
     price(currency:USD)
     product_options{
       title
       prefix
       suffix
       options{
         id
         value
       }
     }
   }
 }
`;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public loading = true;
  products$: Observable<Product[]>;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.products$ = this.apollo
      .watchQuery<Response>({
        query: GET_PRODUCTS
      })
      .valueChanges.pipe(map(result => result.data.products));

  }
}
