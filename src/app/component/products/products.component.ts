import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
import { Subscription } from 'rxjs';


const GET_PRODUCTS = gql`
query Products($currency: Currency){
  products{
     id
     title
     image_url
     price(currency: $currency)
   }
   currency
 }
`;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public loading = true;
  public addCart = false;
  public currency: any;
  public products: any;
  public selectedProducts = [];
  public subTotalCost: number = 0;
  public subTotal: any;
  public defCurrency: string;
  private querySubscription: Subscription;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {
    this.querySubscription = this.apollo
      .watchQuery<any>({
        query: GET_PRODUCTS,
        variables: {
          currency: 'USD'
        }
      })
      .valueChanges.subscribe(({ data, loading }) => {
        this.loading = loading;
        data.products.map(product => {
          product.quantity = 0;
          product.currency = 'USD';
        })
        this.products = data.products;
        this.currency = data.currency;
      });

  }

  /* Add product to cart */
  addToCart(product) {
    this.addCart = true;


    product.quantity++;
    this.calculateSubTotalCost()
    const selectedProduct = product;

    const productExists = this.selectedProducts.includes(product)

    if (!productExists) {
      this.selectedProducts.push(selectedProduct)
      this.calculateSubTotalCost()
    }

  }

  /* Remove product from cart */
  removeFromCart(product) {
    product.quantity = 0;
    this.selectedProducts = this.selectedProducts.filter(prod => prod.id !== product.id)
    this.calculateSubTotalCost()

    if (this.selectedProducts.length == 0) {
      this.subTotalCost = 0;
      this.subTotal = this.subTotalCost;
    }
  }

  /* Go back to products */
  goBack() {
    this.addCart = false;
  }

  /* Increment the quantity */
  incrementQuantity(productId) {
    const productItem = this.selectedProducts.find(product => product.id === productId)
    productItem.quantity += 1
    this.calculateSubTotalCost()
  }

  /* Decrement the quantity */
  decrementQuantity(product) {
    const productItem = this.selectedProducts.find(prod => prod.id === product.id)
    productItem.quantity -= 1
    this.calculateSubTotalCost()
    if (productItem.quantity < 1) {
      this.removeFromCart(product)
    }
  }

  /* Calculate sub total cost */
  calculateSubTotalCost() {
    if (this.selectedProducts.length > 0) {
      this.selectedProducts.map(prod => {
        this.defCurrency = prod.currency;
      })


      const costArray = this.selectedProducts.map(product => {
       return product.quantity * product.price;
      })
      this.subTotalCost = costArray.reduce((sum, num) => {
        return sum + num;
      })

      if (this.defCurrency == 'USD') {
        this.subTotal = '$' + this.subTotalCost.toFixed(2);
      } else {
        this.subTotal = this.defCurrency + this.subTotalCost.toFixed(2);
      }

    } else {
      this.subTotalCost = 0;
      this.subTotal = this.subTotalCost;
    }

  }


  changeCurrency(cur) {
    this.setCurrency(cur)
    this.selectedProducts.forEach(c => {
      c.currency = cur
    });

  }


  setCurrency(currency) {
    this.querySubscription = this.apollo
    .watchQuery<any>({
      query: GET_PRODUCTS,
      variables: {
        currency: currency
      }
    })
    .valueChanges.subscribe(({ data, loading }) => {
      this.loading = loading;
      data.products.map(product => {
        product.quantity = 0;
        product.currency = currency;
      })
      this.products = data.products;
      this.currency = data.currency;

      if (this.selectedProducts.length) {
        console.log("Cart has products")
        const cart = this.selectedProducts.map(product => {
          const newProduct = this.products.filter(prod => prod.id == product.id);
          product.price = newProduct[0].price;

          return product

        })

        this.calculateSubTotalCost()

      }
    });
  }


}
