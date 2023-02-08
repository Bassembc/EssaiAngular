import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageProduct, Product } from '../model/product.model';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products!: Array<Product>;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  currentAction:string="all";
  constructor(private productService: ProductService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null)
    })
    this.handeleGetPageProducts();
  }
  handeleGetPageProducts() {
    this.productService.getPageProducts(this.currentPage, this.pageSize).subscribe({

      next: (data: PageProduct) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
      },
      error: (err) => {
        this.errorMessage = err;

      }
    });
  }
  handleSearchProducts() {
    this.currentAction="search";
    this.currentPage=0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService.searchProducts(keyword,this.currentPage, this.pageSize).subscribe({
      next: (data: PageProduct) => {
        this.products = data.products;
        this.totalPages = data.totalPages;
      }
    });

  }
  handeleGetAllProducts() {
    this.productService.getAllProducts().subscribe({

      next: (data: Product[]) => {
        this.products = data;
      },
      error: (err) => {
        this.errorMessage = err;

      }
    });
  }
  handeleDeleteProduct(p: Product) {
    let conf = confirm("Are you sure?");
    /*let index=this.products.indexOf(p);
    console.log(index);
    this.products.splice(index,1);*/
    if (conf == false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next: (data: boolean) => {
        // this.handeleGetAllProducts();
        let index = this.products.indexOf(p);
        this.products.splice(index, 1);

      }
    })

  }
  handeleSetPromotion(p: Product) {
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next: (data: boolean) => {
        p.promotion = !promo;
      },
      error: (err) => {
        this.errorMessage = err;
      }
    });

  }
  public goToPage(i: number) {
    this.currentPage=i;
    if(this.currentAction=="all")
    this.handeleGetPageProducts();
    else this.handleSearchProducts();

  }
}
