import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { OrderItem } from './order-item.model';
import { Order } from './order.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formData: Order;
  orderItems: OrderItem[];

  constructor(private http: HttpClient) { }

  saveOrUpdateOrder(){
    var body = {
      ...this.formData,
      OrderItems: this.orderItems
    }
    return this.http.post(environment.apiUrl + '/Order',body);
  }

  getOrderList(){
    return this.http.get(environment.apiUrl + "/Order").toPromise();
  }

  getOrderById(id:number): any {
    return this.http.get(environment.apiUrl + "/Order/" + id).toPromise();
  }
}
