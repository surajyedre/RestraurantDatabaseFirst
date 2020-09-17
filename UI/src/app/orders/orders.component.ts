import { OrderService } from './../shared/order.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orderList;

  constructor(public orderService: OrderService,
    private router:Router) { }

  ngOnInit() {
    this.orderService.getOrderList().then(res => {
      this.orderList = res;
    })
  }

  openForEdit(orderId : Number){
    this.router.navigate(['/order/edit/' + orderId]);
  }

}
