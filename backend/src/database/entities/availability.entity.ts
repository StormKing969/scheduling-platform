import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { DayAvailability } from "./day-availability.entity";

@Entity()
export class Availability {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: 30 })
  timeGap: number;

  // ======== TABLE RELATIONSHIPS ========
  @OneToOne(() => User, (user) => user.availability)
  user: User;

  @OneToMany(() => DayAvailability, (days) => days.availability, {
    cascade: true,
  })
  days: DayAvailability[];
  // ======== TABLE RELATIONSHIPS ========

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}