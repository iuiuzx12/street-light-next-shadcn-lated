export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {

    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { isMobile } = useSidebar()

    const handleLogout = async (e?: React.MouseEvent<HTMLDivElement>) => {
        if (e) {
            e.preventDefault();
        }
        setIsLoading(true);
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const res = await response.json();
            setIsLoading(false);
            setError("สำเร็จ");
            router.push("/");
            router.refresh();

            console.log("Logging out...");
        } catch (error) {
            setIsLoading(false);
            console.error("Logout failed:", error);
            return false;
        }

    };


    <DropdownMenuItem
        className="cursor-pointer"
        onClick={handleLogout}
        disabled={isLoading}
    >
        {isLoading ? (
            <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />
        ) : (
            <IconLogout className="w-4 h-4 mr-2" />
        )}
        {isLoading ? "Logging out..." : "Log out"}
    </DropdownMenuItem>