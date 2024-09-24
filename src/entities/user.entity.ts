import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import Product from "./product.entity";
import Cart from "./cart.entity";
import { Exclude, instanceToPlain } from "class-transformer";

@Entity()
export default class User extends BaseEntity
{
    @PrimaryGeneratedColumn()
    id!: number

    @Column({nullable: false})
    firstName!: string

    @Column({nullable: false})
    lastName!: string

    @Column({nullable: false, unique: true})
    email!: string

    @Exclude({ toPlainOnly: true })
    @Column({nullable: false})
    password!: string

    @Column({nullable: false})
    phone!: string

    @OneToMany(() => Product, (product) => product.user) // One user can have many products (hasMany)
    products!: Product[];

    @OneToMany(() => Cart, (cart) => cart.user) // One user can have many carts (hasMany)
    carts!: Cart[];

    @OneToOne(() => Cart, (cart) => cart.user, { // One user can have one cart (hasOne)
        cascade: true, // Optional: to automatically save cart when saving user
    })
    cart!: Cart;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    toJSON() {
        return instanceToPlain(this);
    }
}
