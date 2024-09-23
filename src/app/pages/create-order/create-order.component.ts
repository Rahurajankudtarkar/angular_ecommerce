import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, cartData, OrderModel } from '../../model/Product';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit{
 
  masterService =inject(MasterService);
 ngOnInit(): void {
     this.getCartItems();
 }
  

 cartData:cartData[]=[];
 totalAmount: number=0;
 orderObj:OrderModel=new OrderModel();

 getCartItems(){
  this.masterService.getCartProductsByCustomerId(this.masterService.loggedUserData.custId).subscribe((res:APIResponseModel)=>{
   this.cartData=res.data;
   this.cartData.forEach(element=>{
    this.totalAmount=this.totalAmount+element.productPrice;
   })

  })
}

placeOrder(){
  this.orderObj.CustId=this.masterService.loggedUserData.custId;
  this.orderObj.TotalInvoiceAmount=this.totalAmount;
  this.masterService.onPlaceOrder(this.orderObj).subscribe((res:APIResponseModel)=>{
    if(res.result){
      alert("Order Placed Successfully")
      this.getCartItems();
      this.orderObj=new OrderModel();
      this.totalAmount=0;
      this.masterService.onCartAdded.next(true);
        
    }else{
      alert(res.message);
    }
  });
}
}
