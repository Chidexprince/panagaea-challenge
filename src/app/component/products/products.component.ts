import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  rates: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
        this.apollo
      .watchQuery({
        query: gql`
        query currency {
          currency
        }
        `,
      })
      .valueChanges.subscribe(result => {
        /* this.rates = result.data && result.data.rate;
        this.loading = result.loading;
        this.error = result.error; */
        console.log(result)
      });
  }

}
