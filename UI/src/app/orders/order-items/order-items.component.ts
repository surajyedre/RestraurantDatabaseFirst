import { OrderService } from './../../shared/order.service';
import { NgForm } from '@angular/forms';
import { Item } from './../../shared/item.model';
import { ItemService } from './../../shared/item.service';
import { OrderItem } from './../../shared/order-item.model';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-items',
  templateUrl: './order-items.component.html',
  styleUrls: ['./order-items.component.css']
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.itemService.getItemList().then(res => this.itemList = res as Item[]);
    if (this.data.orderItemIndex == null) {
      this.formData = {
        OrderItemId: null,
        OrderId: this.data.OrderID,
        ItemId: 0,
        ItemName: '',
        Price: 0,
        Quantity: 0,
        Total: 0
      }
    }
    else {
      this.formData = Object.assign({}, this.orderService.orderItems[this.data.orderItemIndex]);
    }

  }

  updatePrice(control) {
    if (control.selectedIndex == 0) {
      this.formData.Price = 0;
      this.formData.ItemName = '';
    }
    else {
      this.formData.Price = this.itemList[control.selectedIndex - 1].Price;
      this.formData.ItemName = this.itemList[control.selectedIndex - 1].Name;
    }

    this.updateTotal();

  }

  updateTotal() {
    this.formData.Total = parseFloat((this.formData.Quantity * this.formData.Price).toFixed(2));
  }

  onSubmit(form: NgForm) {
    if (this.validateForm(form.value)) {
      if (this.data.orderItemIndex == null){
        this.orderService.orderItems.push(form.value);
      }
      else {
        this.orderService.orderItems[this.data.orderItemIndex] = form.value;
      }
     
      this.dialogRef.close();
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemId == 0) {
      this.isValid = false;
    }
    else if (formData.Quantity == 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

}
