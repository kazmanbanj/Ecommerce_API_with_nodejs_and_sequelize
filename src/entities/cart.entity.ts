import { BaseEntity, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./user.entity";
import Product from "./product.entity";
import CartItem from "./cart-item.entity";

@Entity()
export default class Cart extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, (user) => user.carts, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) // Many carts belong to one user (belongsTo)
    user!: User;

    @ManyToMany(() => Product, (product) => product.carts)  // Many carts belong to many products (belongsToMany)
    products!: Product[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems!: CartItem[];

    @OneToOne(() => User, (user) => user.cart)  // One user can have one cart (hasOne)
    userCart!: User; // This establishes the relationship
    @JoinColumn() // This decorator indicates that this side will own the relationship
    cart!: Cart;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
