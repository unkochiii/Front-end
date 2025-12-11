import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,          // swipe back activé
        gestureDirection: "horizontal", // geste horizontal
        headerShown: true,
      }}
    />
  );
}
