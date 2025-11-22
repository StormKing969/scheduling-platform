import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IntegrationAppTypeEnum } from "./integration.entity";
import { User } from "./user.entity";

export enum EventLocationEnumType {
  GOOGLE_MEET_AND_CALENDAR = IntegrationAppTypeEnum.GOOGLE_MEET_AND_CALENDAR,
  ZOOM_MEETING = IntegrationAppTypeEnum.ZOOM_MEETING,
}

@Entity({ name: "events" })
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ default: true })
  isPrivate: boolean;

  @Column({ type: "enum", enum: EventLocationEnumType })
  locationType: EventLocationEnumType;

  // ======== TABLE RELATIONSHIPS ========
  @ManyToOne(() => User, (user) => user.events)
  user: User;
  // ======== TABLE RELATIONSHIPS ========

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}