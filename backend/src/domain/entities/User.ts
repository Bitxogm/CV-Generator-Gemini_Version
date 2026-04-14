export enum UserRole {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly username: string;
  public readonly passwordHash: string;
  public readonly role: UserRole;
  public readonly isActive: boolean;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly passwordResetToken?: string;
  public readonly passwordResetExpires?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.username = props.username;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.passwordResetToken = props.passwordResetToken;
    this.passwordResetExpires = props.passwordResetExpires;
  }

  // Helper: Usuario sin password (para respuestas)
  public toJSON(): Omit<UserProps, 'passwordHash'> {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
