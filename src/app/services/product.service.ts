import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProduct, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products!: Array<Product>;
  constructor() {
    this.products = [
      { id: UUID.UUID(), name: "Computer", price: 6500, promotion: true },
      { id: UUID.UUID(), name: "Printer", price: 1200, promotion: true },
      { id: UUID.UUID(), name: "SmartPhone", price: 1400, promotion: false }

    ];
    for (let index = 0; index < 10; index++) {
      this.products.push({ id: UUID.UUID(), name: "Computer", price: 6500, promotion: true });
      this.products.push({ id: UUID.UUID(), name: "Printer", price: 1200, promotion: true });
      this.products.push({ id: UUID.UUID(), name: "SmartPhone", price: 1400, promotion: false });
    }
  }
  //recherche dans une et unique page
  public searcheProducts(keyword: string): Observable<Product[]> {

    let products = this.products.filter(p => p.name.includes(keyword));
    return of(products);

  }
  //recherche paginee
  public searchProducts(keyword: string ,page:number,size:number): Observable<PageProduct> {

    let results = this.products.filter(p => p.name.includes(keyword));
    let index=page*size;
    let totalPages= ~~(results.length/size);
    if((this.products.length%size)!=0){
      totalPages++;
    }
    let pageProducts=results.slice(index,index+size);
    return of({page:page,size:size,totalPages:totalPages,products:pageProducts});

  }
  public deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter(p => p.id != id);//il va sauvgarder les produit p telle que leurs id est different de l'id passe en parametre
    return of(true);
  }
  public getAllProducts(): Observable<Array<Product>> {
    //le type Observable a pour objectif travail asynchrone
    /*let rnd=Math.random();//objectif est de tester l'erreur de chargement de donnees
    if(rnd<0.5)return throwError(()=> new Error("Internet connexion error")); else */
    return of([...this.products]);
  }
  public getPageProducts(page:number,size:number): Observable<PageProduct>{
  let index=page*size;
    let totalPages= ~~(this.products.length/size);
    if((this.products.length%size)!=0){
      totalPages++;
    }
    let pageProducts=this.products.slice(index,index+size);
    return of({page:page,size:size,totalPages:totalPages,products:pageProducts});
  }
  public setPromotion(id: string): Observable<boolean> {
    let product = this.products.find(p => p.id == id);
    if (product != undefined) {
      product.promotion = !product.promotion;
      return of(true);
    } else return throwError(() => new Error("Product not found"));

  }
}
