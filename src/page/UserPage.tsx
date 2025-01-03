import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Card,
  Label,
  TextInput,
  Alert,
  Spinner,
} from "flowbite-react";
import { useApi } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaKey, FaSignOutAlt } from "react-icons/fa"; // Import the icons

interface User {
  id: number;
  username: string;
  email: string;
}

const UserSettingsPage: React.FC = () => {
  const { apiCall, isLoading } = useApi();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) {
        console.error("No username found in localStorage");
        return;
      }
      try {
        const userData = await apiCall("GET", "/api/users/find", null, {
          params: { param: username },
        });
        console.log("Fetched user data:", userData);
        setUser(userData.content);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, [apiCall, username]);

  const handleSaveChanges = async () => {
    try {
      const updatedUser = await apiCall("PUT", "/api/users/update", editForm, {
        params: {
          email: user?.email,
        },
      });
      setUser(updatedUser);
      setSuccessMessage("Profile updated successfully");
      localStorage.setItem(
        "username",
        editForm.username || user?.username || " "
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      await apiCall(
        "PUT",
        "/api/users/update",
        { password: passwordForm.newPassword },
        {
          params: { email: user?.email },
        }
      );
      setSuccessMessage("Password changed successfully");
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.log(error);
      setPasswordError("Failed to change password. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="p-4">
      <Card>
        <h1 className="text-2xl font-bold mb-4">User Settings</h1>
        {successMessage && (
          <Alert color="success" onDismiss={() => setSuccessMessage(null)}>
            {successMessage}
          </Alert>
        )}
        {user ? (
          <div>
            <div className="mb-4">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <div className="flex items-center justify-start space-x-2">
              <Button size="xs" onClick={() => setIsEditModalOpen(true)}>
                <FaEdit size={15} className="mr-2" />
                <span>Edit Profile</span>
              </Button>
              <Button
                size="xs"
                color="warning"
                onClick={() => setIsPasswordModalOpen(true)}
              >
                <FaKey size={15} className="mr-2" />
                <span>Change Password</span>
              </Button>
              <Button size="xs" color="failure" onClick={handleLogout}>
                <FaSignOutAlt size={15} className="mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center">
            <Spinner aria-label="Loading user data" />
          </div>
        ) : (
          <p>Failed to load user data.</p>
        )}
      </Card>

      {/* Edit Profile Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <Modal.Header>Edit Profile</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <TextInput
                id="username"
                value={editForm.username || user?.username || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                type="email"
                value={editForm.email || user?.email || ""}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
          <Button color="gray" onClick={() => setIsEditModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        show={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      >
        <Modal.Header>Change Password</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <TextInput
                id="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <TextInput
                id="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleChangePassword}>Save Changes</Button>
          <Button color="gray" onClick={() => setIsPasswordModalOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserSettingsPage;
