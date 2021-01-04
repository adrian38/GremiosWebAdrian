import { Component, OnInit } from '@angular/core';
//import { loadStripe, Stripe } from '@stripe/stripe-js'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-payment-stripe',
  templateUrl: './payment-stripe.component.html',
  styleUrls: ['./payment-stripe.component.scss']
})
export class PaymentStripeComponent {
  //private stripe: Stripe;


  constructor() {

  }

  /*  async ngOnInit() {
     // this.stripe = await loadStripe(environment.stripe.testKey);
     const elements = this.stripe.elements();
 
     const style = {
       base: {
         color: '#32325d',
         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
         fontSmoothing: 'antialiased',
         fontSize: (window.innerWidth <= 500) ? '12px' : '16px',
         '::placeholder': {
           color: '#aab7c4'
         }
       },
       invalid: {
         color: '#fa755a',
         iconColor: '#fa755a'
       }
     };
 
     const card = elements.create('card', { style });
 
 
     card.mount('#card-element');
 
     card.on('change', (event) => {
       const displayError = document.getElementById('card-errors');
       if (event.error) {
         console.log("error");
         displayError.textContent = event.error.message;
 
 
       } else {
         console.log(event);
         displayError.textContent = '';
 
       }
 
     });
 
 
   } */




}
