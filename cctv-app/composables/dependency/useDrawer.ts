export default function useComment() {

    const drawer = useState("drawer", () => true)



    return {
        drawer,
    }

}