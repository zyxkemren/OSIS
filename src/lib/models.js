import mongoose from "mongoose";

const GeneralSchema = new mongoose.Schema(
  {
    server_name: { type: String, default: "Server Webstore" },
    discord_link: { type: String },
    selected_template: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const IntegrationSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, unique: true },
    description: { type: String, default: "My Theme" },
    selected_template: { type: Number, default: 0 },
    color: { type: String, default: "#1f2129" },
  },
  { timestamps: true }
);

const NotificationSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, unique: true },
    description: { type: String, default: "My Theme" },
    selected_template: { type: Number, default: 0 },
    color: { type: String, default: "#1f2129" },
  },
  { timestamps: true }
);

const PaymentSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, unique: true },
    description: { type: String, default: "My Theme" },
    selected_template: { type: Number, default: 0 },
    color: { type: String, default: "#1f2129" },
  },
  { timestamps: true }
);

const StatsSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, unique: true },
    description: { type: String, default: "My Theme" },
    selected_template: { type: Number, default: 0 },
    color: { type: String, default: "#1f2129" },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, unique: true },
    description: { type: String, default: "My Theme" },
    selected_template: { type: Number, default: 0 },
    color: { type: String, default: "#1f2129" },
  },
  { timestamps: true }
);

const ThemeSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true, unique: true },
    color: { type: String, required: true },
    description: { type: String, default: "My Theme #1" },
    selected: { type: Boolean, default: false },
    selected_template: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default ThemeSchema;
