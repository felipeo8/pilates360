import { Alert, Platform } from "react-native";

export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: "default" | "cancel" | "destructive";
}

export class AlertService {
  /**
   * Shows a confirmation dialog with OK/Cancel buttons
   * @param title - The title of the alert
   * @param message - The message to display
   * @param onConfirm - Callback when user confirms
   * @param onCancel - Optional callback when user cancels
   */
  static showConfirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    if (this.isWeb()) {
      // Use native browser confirm for web
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    } else {
      // Use React Native Alert for mobile
      Alert.alert(title, message, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: "OK",
          style: "default",
          onPress: onConfirm,
        },
      ]);
    }
  }

  /**
   * Shows a simple alert with just an OK button
   * @param title - The title of the alert
   * @param message - The message to display
   * @param onPress - Optional callback when OK is pressed
   */
  static showAlert(title: string, message: string, onPress?: () => void): void {
    if (this.isWeb()) {
      // Use native browser alert for web
      window.alert(`${title}\n\n${message}`);
      if (onPress) {
        onPress();
      }
    } else {
      // Use React Native Alert for mobile
      Alert.alert(title, message, [
        {
          text: "OK",
          onPress,
        },
      ]);
    }
  }

  /**
   * Shows a custom alert with multiple buttons
   * @param title - The title of the alert
   * @param message - The message to display
   * @param buttons - Array of button configurations
   */
  static showCustomAlert(
    title: string,
    message: string,
    buttons: AlertButton[]
  ): void {
    if (this.isWeb()) {
      // For web, we'll simulate the behavior with confirm/alert
      if (buttons.length === 1) {
        // Single button - use alert
        window.alert(`${title}\n\n${message}`);
        if (buttons[0].onPress) {
          buttons[0].onPress();
        }
      } else {
        // Multiple buttons - use confirm (limited to 2 options on web)
        const confirmButton = buttons.find((b) => b.style !== "cancel");
        const cancelButton = buttons.find((b) => b.style === "cancel");

        if (window.confirm(`${title}\n\n${message}`)) {
          if (confirmButton?.onPress) {
            confirmButton.onPress();
          }
        } else {
          if (cancelButton?.onPress) {
            cancelButton.onPress();
          }
        }
      }
    } else {
      // Use React Native Alert for mobile
      Alert.alert(title, message, buttons);
    }
  }

  /**
   * Shows a destructive confirmation (e.g., for logout, delete actions)
   * @param title - The title of the alert
   * @param message - The message to display
   * @param destructiveText - Text for the destructive action (e.g., "Logout", "Delete")
   * @param onConfirm - Callback when user confirms the destructive action
   * @param onCancel - Optional callback when user cancels
   */
  static showDestructiveConfirm(
    title: string,
    message: string,
    destructiveText: string,
    onConfirm: () => void,
    onCancel?: () => void
  ): void {
    if (this.isWeb()) {
      // Use native browser confirm for web
      if (window.confirm(`${title}\n\n${message}`)) {
        onConfirm();
      } else if (onCancel) {
        onCancel();
      }
    } else {
      // Use React Native Alert for mobile
      Alert.alert(title, message, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: destructiveText,
          style: "destructive",
          onPress: onConfirm,
        },
      ]);
    }
  }

  /**
   * Checks if the current platform is web
   * @returns true if running on web, false otherwise
   */
  private static isWeb(): boolean {
    return Platform.OS === "web" || typeof window !== "undefined";
  }
}

export default AlertService;
