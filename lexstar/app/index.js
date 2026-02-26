import { Redirect } from 'expo-router';
import { useUser } from '../src/context/UserContext';

export default function Index() {
  const { user } = useUser();

  if (user.hasOnboarded) {
    return <Redirect href="/(tabs)/feed" />;
  }

  return <Redirect href="/onboarding/welcome" />;
}
