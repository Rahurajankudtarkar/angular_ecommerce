import { Component, OnInit } from '@angular/core';
import { APIResponseModel, Customer, Sale } from '../../model/Product';
import { MasterService } from '../../service/master.service';
import { Constant } from '../../constant/constant';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit{
  loggedUserData:Customer=new Customer();
  sales:Sale[]=[];

  constructor(private masterService:MasterService){ 
   
  }

  ngOnInit(): void {
    const isUser=localStorage.getItem(Constant.LOCAL_KEY)
      if(isUser){
        const parseObj=JSON.parse(isUser);
        this.loggedUserData=parseObj;
        this.getSalesByCustomerId();
        
      }

  }

  getSalesByCustomerId(){
      this.masterService.getAllSalesByCustomerId(this.loggedUserData.custId).subscribe((res:APIResponseModel)=>{
        
        if(res.result){
          this.sales=res.data;

        }else{
          console.log(res.message)
        }
      })
  }

}
