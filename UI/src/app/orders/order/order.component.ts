import { Customer } from './../../shared/customer.model';
import { OrderItemsComponent } from './../order-items/order-items.component';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomerService } from 'src/app/shared/customer.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  customerList: Customer[];

  isValid: boolean = true;

  constructor(public orderService: OrderService,
    private dialog: MatDialog,
    public customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let orderId = this.currentRoute.snapshot.paramMap.get('id');
    if(orderId == null){
      this.resetForm();
    }
    else{
      this.orderService.getOrderById(parseInt(orderId)).then(res =>{
        this.orderService.formData = res.order;
        this.orderService.orderItems = res.orderItems;
      });
    }
    
    this.customerService.getCustomerList().then(res => {
      this.customerList = res as Customer[];
    });
  }


  resetForm(form?: NgForm) {
    if (form = null)
      form.resetForm();

    this.orderService.formData = {
      OrderId: null,
      OrderNo: Math.floor((1000000 + Math.random() * 900000)).toString(),
      CustomerID: 0,
      PaymentMethod: '',
      GrandTotal: 0,
    }

    this.orderService.orderItems = [];

  }

  AddOrEditOrderItem(orderItemIndex, OrderID) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, OrderID };

    this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
      this.updateGrandTotal();
    });

  }

  onDeleteOrderItem(orderItemID: number, index: number) {
    this.orderService.orderItems.splice(index, 1);
    this.updateGrandTotal();
  }


  updateGrandTotal() {
    this.orderService.formData.GrandTotal = this.orderService.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);

    this.orderService.formData.GrandTotal = parseFloat(this.orderService.formData.GrandTotal.toFixed(2));
  }

  validateForm() {
    this.isValid = true;
    if (this.orderService.formData.CustomerID == 0) {
      this.isValid = false;
    }
    else if (this.orderService.orderItems.length == 0) {
      this.isValid = false;
    }
    return this.isValid;
  }

  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.orderService.saveOrUpdateOrder().subscribe(res => {
        this.resetForm();
        this.toastr.success('Submitted Successfully', 'Restaurant App');
        this.router.navigate(['/orders']);
      });
    }
  }
}
