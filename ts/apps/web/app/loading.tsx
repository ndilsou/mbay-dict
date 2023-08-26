import { Alphabet } from "@/components/alphabet";
import { LetterScroll } from "@/components/letter-scroll";
import { Loading } from "@/components/loading";
import { PageContainer } from "@/components/page-container";

export default function LoadingPage() {
  return (
    <PageContainer className="flex w-full items-center justify-center text-xl">
      <h6 id="main-title" className="" />
      <LetterScroll className="z-40 fixed top-1/2 transform -translate-y-1/2 right-4" />
      <Alphabet />
      <Loading className="mt-4" />
    </PageContainer>
  );
}
