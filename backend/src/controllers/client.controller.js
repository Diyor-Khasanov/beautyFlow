const asyncHandler = require("express-async-handler");
const Client = require("../models/Client.model");
const User = require("../models/User.model");
const Salon = require("../models/Salon.model");

const checkSalonOwnership = async (salonId, userId) => {
  const salon = await Salon.findById(salonId);
  if (!salon || !salon.owner.equals(userId)) {
    throw new Error("You do not have access rights to this salon.");
  }
  return salon;
};

const createClient = asyncHandler(async (req, res) => {
  const { salonId } = req.params;
  const { name, phone, email, notes, preferredMasterId } = req.body;
  const { _id: userId, role } = req.user;

  if (role === "owner") {
    await checkSalonOwnership(salonId, userId);
  } else if (role === "master") {
    const masterUser = await User.findById(userId);
    if (masterUser.salon.toString() !== salonId) {
      res.status(403);
      throw new Error("A Master can only add clients to their own salon.");
    }
  } else if (role !== "admin") {
    res.status(403);
    throw new Error("Insufficient permissions.");
  }

  const existingClient = await Client.findOne({ salon: salonId, phone });
  if (existingClient) {
    res.status(400);
    throw new Error(
      "A client with this phone number is already registered in your salon."
    );
  }

  const client = await Client.create({
    salon: salonId,
    name,
    phone,
    email,
    notes,
    preferredMaster: preferredMasterId,
    lastVisit: new Date(),
  });

  await Salon.findByIdAndUpdate(salonId, { $inc: { clientCount: 1 } });

  res.status(201).json({
    success: true,
    message: "Client successfully added.",
    client,
  });
});

const getClients = asyncHandler(async (req, res) => {
  const { salonId } = req.params;
  const { _id: userId, role } = req.user;

  const userSalon = await User.findById(userId).select("salon");

  if (role !== "admin" && userSalon.salon.toString() !== salonId) {
    res.status(403);
    throw new Error("Access denied. You do not belong to this salon.");
  }

  const clients = await Client.find({ salon: salonId })
    .populate("preferredMaster", "phone email")
    .sort({ lastVisit: -1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    clients,
  });
});

const updateClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;
  const { name, email, notes, preferredMasterId } = req.body;

  const client = await Client.findById(clientId);

  if (!client) {
    res.status(404);
    throw new Error("Client not found.");
  }

  const userSalon = await User.findById(req.user._id).select("salon");

  if (
    req.user.role !== "admin" &&
    userSalon.salon.toString() !== client.salon.toString()
  ) {
    res.status(403);
    throw new Error("You cannot edit clients from another salon.");
  }

  client.name = name || client.name;
  client.email = email || client.email;
  client.notes = notes || client.notes;
  client.preferredMaster = preferredMasterId || client.preferredMaster;

  const updatedClient = await client.save();

  res.status(200).json({
    success: true,
    message: "Client information updated.",
    client: updatedClient,
  });
});

const deleteClient = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  const client = await Client.findById(clientId);

  if (!client) {
    res.status(404);
    throw new Error("Client not found.");
  }
  if (req.user.role === "owner") {
    const userSalon = await User.findById(req.user._id).select("salon");
    if (userSalon.salon.toString() !== client.salon.toString()) {
      res.status(403);
      throw new Error("You cannot delete clients from another salon.");
    }
  } else if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Insufficient permissions to delete client.");
  }

  await Client.deleteOne({ _id: clientId });
  await Salon.findByIdAndUpdate(client.salon, { $inc: { clientCount: -1 } });

  res.status(200).json({
    success: true,
    message: "Client successfully deleted.",
  });
});

module.exports = {
  createClient,
  getClients,
  updateClient,
  deleteClient,
};
