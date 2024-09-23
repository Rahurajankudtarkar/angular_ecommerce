import { Component,inject,OnDestroy,OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, CartModel, Category, Customer, ProductList } from '../../model/Product';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit,OnDestroy {
  loggedUserData:Customer=new Customer();
  constructor(){
   this.loggedUserData=this.masterService.loggedUserData;
  }
 //productList:ProductList[]=[]; this is an old way
 //now using signal
 productList =signal<ProductList[]>([]);
 subscriptionList:Subscription[]=[];

  masterService= inject(MasterService)
  ngOnInit(): void {
      this.loadAllProducts();
      this.categeoryList$=this.masterService.getAllCategory().pipe(map(item =>item.data))
  }

  loadAllProducts(){
   this.subscriptionList.push(this.masterService.getAllProducts().subscribe((res:APIResponseModel)=>{
        this.productList.set(res.data)
    }));
  }
   
  ngOnDestroy(): void {
      this.subscriptionList.forEach(element=>{
        element.unsubscribe();
      })
  }


  //lets do by asycpipe
  categeoryList$:Observable<Category[]> =new Observable<Category[]>();
  //we need not unscrible using async pipe

  getAllProductsByCategory(id:number){
   this.masterService.getAllProductsByCategory(id).subscribe((res:APIResponseModel)=>{
    this.productList.set(res.data);
   })
  }

  //add to cart
  onAddtoCart(id:number){
    const newObj:CartModel=new CartModel();
    newObj.ProductId=id;
    newObj.CustId=this.loggedUserData.custId;
    console.log(newObj)
    this.masterService.addtocart(newObj).subscribe((res:APIResponseModel)=>{
      if(res.result){
        alert("Product Added to Cart");
        this.masterService.onCartAdded.next(true);
      }else{
        alert(res.message);
      }
    })

  }
  

}
