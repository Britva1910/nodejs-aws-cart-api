import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart, CartStatuses } from '../models';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { CartEntity, CartStatus } from '../entity/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CartEntity> {
    return await this.cartRepository.findOne({
      where: { status: CartStatus.OPEN, user: { id: userId } },
      relations: { items: { product: true } },
    });
  }

  createByUserId(userId: string) {
    const id = v4();
    const userCart = {
      id,
      items: [],
      created_at: '',
      status: CartStatuses.OPEN,
      updated_at: '',
      user_id: '',
    };

    return userCart;
  }
  /* 
  async findOrCreateByUserId(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { userId, status: CartStatus.OPEN },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        status: CartStatus.OPEN,
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  } */

  updateByUserId(userId: string, { items }: Cart) {
    /*  const { id, ...rest } = this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      ...rest,
      items: [...items],
    };

    this.userCarts[userId] = { ...updatedCart };

    return { ...updatedCart }; */
  }

  removeByUserId(userId): void {
    /*  this.userCarts[userId] = null; */
  }
}
