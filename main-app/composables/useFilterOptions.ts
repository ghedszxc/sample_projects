// const { currentUser } = useLocalAuth();

export default function useFilterOptions() {
  const siteOptions = useState("siteOptions", (): TSite[] => []);

  return siteOptions;
}
