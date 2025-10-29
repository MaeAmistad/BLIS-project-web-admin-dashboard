import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Typography,
} from "@mui/material";

const RaiserModal = ({ open, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    contact: "",
    address: "",
    typeOfRaiser: "",
    farmName: "",
    farmLocation: "",
    farmSize: "",
    numberOfWorkers: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        fullName: "",
        gender: "",
        contact: "",
        address: "",
        typeOfRaiser: "",
        farmName: "",
        farmLocation: "",
        farmSize: "",
        numberOfWorkers: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {initialData ? "Edit Raiser Information" : "Add Raiser Information"}
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "#d9f5d6", p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Contact No."
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Type of Raiser"
              name="typeOfRaiser"
              value={formData.typeOfRaiser}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>

          {/* Farm Information */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Farm Information
            </Typography>
            <TextField
              fullWidth
              label="Farm Name (If Applicable)"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Farm Location"
              name="farmLocation"
              value={formData.farmLocation}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Farm Size (Optional)"
              name="farmSize"
              value={formData.farmSize}
              onChange={handleChange}
              margin="dense"
            />
            <TextField
              fullWidth
              label="Number of Workers (Optional)"
              name="numberOfWorkers"
              value={formData.numberOfWorkers}
              onChange={handleChange}
              margin="dense"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: "#4CAF50", "&:hover": { backgroundColor: "#45A049" } }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RaiserModal;
