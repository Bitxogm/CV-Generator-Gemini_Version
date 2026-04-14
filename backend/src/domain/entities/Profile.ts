export interface ProfileProps {
  id: string;
  userId: string;
  fullName: string;
  title: string;
  summary?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  skills: string[];
  isPublic: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Profile {
  public readonly id: string;
  public readonly userId: string;
  public readonly fullName: string;
  public readonly title: string;
  public readonly summary?: string;
  public readonly phone?: string;
  public readonly website?: string;
  public readonly linkedin?: string;
  public readonly github?: string;
  public readonly skills: string[];
  public readonly isPublic: boolean;
  public readonly views: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: ProfileProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.fullName = props.fullName;
    this.title = props.title;
    this.summary = props.summary;
    this.phone = props.phone;
    this.website = props.website;
    this.linkedin = props.linkedin;
    this.github = props.github;
    this.skills = props.skills;
    this.isPublic = props.isPublic;
    this.views = props.views;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Helper: Incrementar vistas
  public incrementViews(): Profile {
    return new Profile({
      ...this,
      views: this.views + 1,
    });
  }
}
