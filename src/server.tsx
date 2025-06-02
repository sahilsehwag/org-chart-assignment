import { createServer } from "miragejs";
import type { AnyResponse } from "miragejs/-types";
import type { Employee } from "~/types";

const employees: Employee[] = [
	// Level 0
	{
		id: "1",
		name: "Mark Hill",
		designation: "Chief Executive Officer",
		team: "Executive",
		manager: null,
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=MH",
	},

	// Level 1 (reporting to CEO)
	{
		id: "2",
		name: "Sarah Johnson",
		designation: "Chief Technology Officer",
		team: "Technology",
		manager: "1",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=SJ",
	},
	{
		id: "3",
		name: "Tom Lee",
		designation: "Chief Marketing Officer",
		team: "Marketing",
		manager: "1",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=TL",
	},
	{
		id: "4",
		name: "Jane Doe",
		designation: "Chief Financial Officer",
		team: "Finance",
		manager: "1",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=JD",
	},

	// Level 2 (reporting to execs)
	{
		id: "5",
		name: "Alice Green",
		designation: "Engineering Manager",
		team: "Technology",
		manager: "2",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=AG",
	},
	{
		id: "6",
		name: "Robert Brown",
		designation: "Infrastructure Manager",
		team: "Technology",
		manager: "2",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=RB",
	},
	{
		id: "7",
		name: "Emily Stone",
		designation: "Marketing Manager",
		team: "Marketing",
		manager: "3",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=ES",
	},
	{
		id: "8",
		name: "Victor Black",
		designation: "Advertising Manager",
		team: "Marketing",
		manager: "3",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=VB",
	},
	{
		id: "9",
		name: "Lisa White",
		designation: "Finance Manager",
		team: "Finance",
		manager: "4",
		avatar: "https://placehold.co/80x80/E0E0E0/333?text=LW",
	},

	// Level 3+ (generate 41 additional employees)
	...Array.from({ length: 10 }).map((_, i) => {
		const id = (10 + i).toString();
		const roles = [
			{ manager: "5", team: "Technology", title: "Frontend Developer" },
			{ manager: "5", team: "Technology", title: "Backend Developer" },
			{ manager: "6", team: "Technology", title: "DevOps Engineer" },
			{ manager: "6", team: "Technology", title: "Security Analyst" },
			{ manager: "7", team: "Marketing", title: "Content Strategist" },
			{ manager: "7", team: "Marketing", title: "Social Media Manager" },
			{ manager: "8", team: "Marketing", title: "Ad Specialist" },
			{ manager: "8", team: "Marketing", title: "SEO Analyst" },
			{ manager: "9", team: "Finance", title: "Accountant" },
			{ manager: "9", team: "Finance", title: "Internal Auditor" },
		];
		const role = roles[i % roles.length];

		return {
			id,
			name: `Employee ${id}`,
			designation: role.title,
			team: role.team,
			manager: role.manager,
			avatar: `https://placehold.co/80x80/E0E0E0/333?text=E${id}`,
		};
	}),
];

export const runServer = () => {
	// MirageJS Mock API
	createServer({
		routes() {
			this.namespace = "api";

			this.get("/employees", () => employees);
			this.put("/employees/:id", (_, request): AnyResponse => {
				let id = request.params.id;
				let attrs = JSON.parse(request.requestBody);
				let emp = employees.find((e) => e.id === id);
				if (emp) {
					emp.manager = attrs.manager;
					emp.team = attrs.team;
					for (const id of attrs.ids) {
						let emp = employees.find((e) => e.id === id);
						if (emp) {
							emp.team = attrs.team;
						}
					}
				}
				return emp as NonNullable<AnyResponse>;
			});
		},
	});
};

export const fetchEmployees = async () => {
	const res = await fetch("/api/employees");
	return res.json();
};

export type UpdateManagerParams = {
	id: Employee["id"];
	managerId: Employee["manager"];
	team: Employee["team"];
	ids: Employee["id"][];
};

export const updateManager = async ({
	id,
	managerId,
	team,
	ids,
}: UpdateManagerParams) => {
	await fetch(`/api/employees/${id}`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ manager: managerId, team, ids }),
	});
};
