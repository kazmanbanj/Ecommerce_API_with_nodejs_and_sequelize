import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import Cart from './cart.entity';
import Product from './product.entity';

@Entity('cartItems')
export default class CartItem {
    @PrimaryColumn()
    cartId!: number;

    @PrimaryColumn()
    productId!: number;

    @ManyToOne(() => Cart, (cart) => cart.cartItems)
    @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
    cart!: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems)
    @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
    product!: Product;

    @Column({ nullable: true })
    quantity!: number;
}