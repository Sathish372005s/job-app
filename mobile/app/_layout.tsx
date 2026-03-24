
import { Stack } from 'expo-router';
import { useAuthStore } from './store/authstore';

export default function RootLayout() {
  const {token,role}=useAuthStore();
  return (
    <Stack screenOptions={{headerShown:false}}>
      {token && role === "jobseeker" && <Stack.Screen name="(usertabs)" />}
      {token && role === "recruiter" && <Stack.Screen name="(recruitertab)" />}
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}
