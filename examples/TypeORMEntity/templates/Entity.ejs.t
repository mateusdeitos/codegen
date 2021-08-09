import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('<%-h.changeCase.lower(name)%>')
export class User {

	@PrimaryColumn()
	id?: string;

	@Column()
	name: string;

	@Column()
	password: string;

	@Column()
	email: string;

	@Column()
	driver_license: string;

	@Column()
	isAdmin: boolean;

	@Column()
	@Exclude()
	avatar: string;

	@CreateDateColumn()
	created_at: Date;

	@Expose()
	avatar_url(): string {
		switch (process.env.STORAGE_PROVIDER) {
			case 'local':
				return `${process.env.APP_API_URL}:${process.env.PORT}/avatar/${this.avatar}`;

			case 's3':
				return `${process.env.AWS_BUCKET_URL}/avatar/${this.avatar}`
		}
		return null;
	}

	constructor() {
		if (!this.id) this.id = v4();
	}

}
© 2021 GitHub, Inc.
Terms
Privacy
Security
Status
Docs
Contact GitHub
Pricing
API
Training
Blog
About
Loading complete Octotree
mate.deitos (free user)
