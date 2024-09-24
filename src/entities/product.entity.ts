import { BaseEntity, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import User from "./user.entity";
import Cart from "./cart.entity";
import CartItem from "./cart-item.entity";

@Entity()
export default class Product extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({nullable: false})
    title!: string

    @Column({nullable: false})
    price!: string

    @Column({nullable: false})
    imageUrl!: string

    @Column({nullable: false})
    description!: string

    @ManyToOne(() => User, (user) => user.products, { onUpdate: 'CASCADE', onDelete: 'CASCADE' }) // Many products belong to one user (belongsTo)
    user!: User;

    @ManyToMany(() => Cart, (cart) => cart.products, { // Many products belongs to many carts (belongsToMany)
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    @JoinTable({ // This decorator creates the join table
        name: 'cartItems', // Name of the junction table
    })
    carts!: Cart[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.product)
    cartItems!: CartItem[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;
}
