import { pgTable, serial, varchar, boolean, uniqueIndex, foreignKey, integer, time, pgEnum, date } from "drizzle-orm/pg-core";

export const team = pgTable("team", {
  id: serial().primaryKey().notNull(),
  name: varchar().notNull(),
  defaultTeam: boolean("default_team").default(false).notNull(),
});

export const group = pgTable(
  "group",
  {
    id: serial().primaryKey().notNull(),
    name: varchar().notNull(),
    teamId: integer("team_id").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.id],
      name: "group_team_id_fkey",
    }),
  ]
);

export interface employeeV {
  id: number;
  firstName: string;
  lastName: string;
  teamId: number;
  groupId: number;
  groupName: string;
}

export const employee = pgTable(
  "employee",
  {
    id: serial().primaryKey().notNull(),
    firstName: varchar("first_name").notNull(),
    lastName: varchar("last_name").notNull(),
    groupId: integer("group_id").notNull(),
    teamId: integer("team_id").notNull(),
  },
  (table) => [
    uniqueIndex("employee_first_name_last_name_idx").using(
      "btree",
      table.firstName.asc().nullsLast().op("text_ops"),
      table.lastName.asc().nullsLast().op("text_ops")
    ),
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [group.id],
      name: "employee_group_id_fkey",
    }),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [team.id],
      name: "employee_team_id_fkey",
    }),
  ]
);

export interface FullSchedule {
  label: string;
  start: string;
  end: string;
  color: string;
  shiftType: typeof shiftTypes.enumValues;
}

export interface EmployeesSchedule {
  employeeId: number;
  shiftId: number;
  year: number;
  month: number;
  day: number;
  label: string;
  start: string;
  end: string;
  color: string;
  shiftType: typeof shiftTypes.enumValues;
}

export const schedule = pgTable(
  "schedule",
  {
    id: serial().primaryKey().notNull(),
    employeeId: integer("employee_id").notNull(),
    shiftId: integer("shift_id").notNull(),
    year: integer().notNull(),
    month: integer().notNull(),
    day: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.employeeId],
      foreignColumns: [employee.id],
      name: "schedule_employee_id_fkey",
    }),
    foreignKey({
      columns: [table.shiftId],
      foreignColumns: [shift.id],
      name: "schedule_shift_id_fkey",
    }),
  ]
);

export const shiftTypes = pgEnum("shift_types", ["NORMAL", "NIGHT", "VACATION", "LEAVE_ON_REQUEST", "TRAINING", "REMOTE", "DELEGATION", "OVERTIME"]);

export const shift = pgTable("shift", {
  id: serial().primaryKey().notNull(),
  label: varchar(),
  start: time().notNull(),
  end: time().notNull(),
  color: varchar(),
  shiftType: shiftTypes("shift_type"),
});

export const holiday = pgTable("holiday", {
  id: serial().primaryKey().notNull(),
  name: varchar(),
  date: date().notNull(),
});
