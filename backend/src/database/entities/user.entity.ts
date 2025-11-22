import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { hashValue } from "../../utils/bcrypt";
import bcrypt from "bcrypt";
import { Integration } from "./integration.entity";
import { Event } from "./event.entity";
import { Availability } from "./availability.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, type: "varchar", length: 255 })
  name: string;

  @Column({ nullable: false, type: "varchar", length: 255, unique: true })
  username: string;

  @Column({ nullable: false, type: "varchar", length: 255, unique: true })
  email: string;

  @Column({ nullable: false, type: "varchar", length: 255, unique: true })
  password: string;

  @Column({ nullable: true })
  imageUrl: string;

  // ======== TABLE RELATIONSHIPS ========
  @OneToMany(() => Event, (event) => event.user, {
    cascade: true,
  })
  events: Event[];

  @OneToMany(() => Integration, (integration) => integration.user, {
    cascade: true,
  })
  integrations: Integration[];

  @OneToOne(() => Availability, (availability) => availability.user, {
    cascade: true,
  })
  @JoinColumn()
  availability: Availability;
  // ======== TABLE RELATIONSHIPS ========

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  omitPassword(): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword as Omit<User, "password">;
  }
}