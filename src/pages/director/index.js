import {useRouter} from "next/router";
import {useEffect} from "react";

// Always redirect to the tournaments list.
const Index = () => {
  const router = useRouter();
  useEffect(() => {
    if (!router) {
      return;
    }
    router.replace('/director/tournaments');
  }, [router]);

  return '';
}

export default Index;
