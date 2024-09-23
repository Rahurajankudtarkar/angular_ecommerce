import { Component,ElementRef,inject,OnInit,ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { APIResponseModel, cartData, Customer, LoginModel } from './model/Product';
import { FormsModule } from '@angular/forms';
import { MasterService } from './service/master.service';
import { Constant } from './constant/constant';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ecommerce_app';
 registerObj: Customer=new Customer();
 loginObj: LoginModel=new LoginModel();
 //to show the user is logged in
 loggedUserData: Customer=new Customer();

 ngOnInit(): void {
     const isUser=localStorage.getItem(Constant.LOCAL_KEY)
     if(isUser!=null){
      const parseObj=JSON.parse(isUser);
      this.loggedUserData=parseObj;
      this.getCartItems();
     }
     this.masterService.onCartAdded.subscribe((res:boolean)=>{
      if(res){
        this.getCartItems();
      }
     })
 }
 masterService=inject(MasterService);

  @ViewChild("registerModel") registerModel: ElementRef | undefined;

  @ViewChild("loginModel") LoginModel: ElementRef | undefined;

  //cart
  isCartPopupOpen:boolean=false;
  openRegisterModel(){
      if(this.registerModel){
        this.registerModel.nativeElement.style.display="block"
      }
  }

  closeRegisterModel(){
    if(this.registerModel){
      this.registerModel.nativeElement.style.display="none"
    }
}
///login
openLoginModel(){
  if(this.LoginModel){
    this.LoginModel.nativeElement.style.display="block"
  }
}

closeLoginModel(){
if(this.LoginModel){
  this.LoginModel.nativeElement.style.display="none"
}
}


onRegister(){
  this.masterService.registerNewCustomer(this.registerObj).subscribe((res:APIResponseModel)=>{
    if(res.result){
      
      alert("Registration successful")
      this.closeRegisterModel();
    }else{
      alert(res.message);
    }
   
  });
}

///login
onLogin(){
this.masterService.onLogin(this.loginObj).subscribe((res:APIResponseModel)=>{
  if(res.result){
    this.loggedUserData=res.data;
    localStorage.setItem(Constant.LOCAL_KEY,JSON.stringify(res.data))
    alert('Login Suceessfull')
    this.closeLoginModel();

  }else{
    alert(res.message)
  }
})
}

logioff()
{
   localStorage.removeItem(Constant.LOCAL_KEY)
   this.loggedUserData=new Customer();
   window.location.reload();
}


//cart
showCartPopup(){
  this.isCartPopupOpen=!this.isCartPopupOpen;
}
cartData:cartData[]=[];
totalQuantity: number = 0;
totalPrice: number = 0;


getCartItems(){
  this.masterService.getCartProductsByCustomerId(this.loggedUserData.custId).subscribe((res:APIResponseModel)=>{
   this.cartData=res.data;
   this.calculateCartTotals();

  })
}

//cart item calculate the quantty and price
calculateCartTotals() {
  this.totalQuantity = this.cartData.reduce((acc, item) => acc + item.quantity, 0);
  this.totalPrice = this.cartData.reduce((acc, item) => acc + (item.quantity * item.productPrice), 0);
}

//cart item delete
onRemoveProduct(cartId:number){
  this.masterService.deleteProductFromCartById(cartId).subscribe((res:APIResponseModel)=>{
    if(res.result){
      alert("Product deleted successfully");
      this.getCartItems();
    }else{
      alert(res.message)
    }
  })
}
}
