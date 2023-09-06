import { PageContainer } from "@/components/page-container";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Heart, Sprout } from "lucide-react";

export default async function Home() {
  return (
    <PageContainer className="prose lg:prose-xl dark:prose-invert prose-headings:my-auto gap-10">
      <div className="flex flex-col gap-2">
        <Link href="/fr/index/a">
          <h2 className="p-2">Dictionnaire Francais / Mbaye</h2>
        </Link>
        <Link href="/en/index/a">
          <h2 className="p-2">English / Mbay Dictionary</h2>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-4">
              <Heart className="h-6 w-6" />
              <span>
                <Link href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/#title">
                  A la mémoire de John Keegan
                </Link>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="">
              <p className="">
                La traduction française disponible sur ce site n&apos;aurait pas
                été possible sans les travaux de recherche linguistique sur les
                langues Sara-Bagirmi du Sud du Tchad de John Keegan.
              </p>
              <p>
                Je vous invite à visiter son site web via le lien ci-dessus pour
                découvrir des traductions françaises d&apos;autres langues
                telles que le Sara, Ngambay, Na et une dizaine d&apos;autres
                langues du Sud du Tchad.
              </p>
              <p>
                Le Mbaye est la seul langues qu&apos;il n&apos;eut pas le temps
                de traduire avant de nous quitter.
              </p>
              <p>
                La version originale anglaise du dictionnaire est accessible{" "}
                <Link href="https://morkegbooks.com/Services/World/Languages/SaraBagirmi/SoundDictionary/Mbay/">
                  ici
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>
        <Alert className="dark:bg-emerald-800 bg-emerald-300">
          <Sprout className="h-4 w-4" />
          <AlertTitle className="">
            ASSOCIATION DE SOLIDARITE ET POUR LE DEVELOPPEMENT DE LA CULTURE
            MBAYE
          </AlertTitle>
          <AlertDescription>
            <div className="prose lg:prose-xl dark:prose-invert max-w-none"></div>
            <p className="prose lg:prose-xl dark:prose-invert max-w-none">
              Ce site est mis a la disposition de la communauté et diaspora
              Mbaye au Tchad et dans le monde dans l&apos;espoir de préserver
              notre langue et notre culture.
            </p>
          </AlertDescription>
        </Alert>
      </div>
    </PageContainer>
  );
}
