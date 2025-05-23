
import { BreadcrumbNav } from "@/components/BreadcrumbNav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const GroupDetailsLoading = () => {
  const breadcrumbItems = [
    { label: "Groups", href: "/groups" },
    { label: "Loading..." }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <BreadcrumbNav items={breadcrumbItems} className="mb-8" />
          <Card className="w-full mb-6">
            <CardHeader>
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-1/4 mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-20" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-10 w-1/4" />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};
