import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const runtime = "edge";
export const metadata: Metadata = {
  title: 'Privacy Policy',
};

const page = () => {
  return (
    <>
      <main className="flex min-h-screen lg:w-3/4 gap-8 flex-col mx-auto p-4 mt-4 lg:mt-0 lg:p-20">
        <Button
          variant="outline"
          size="icon"
          className="bg-transparent hover:bg-gray-100"
          asChild
        >
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="text-foreground text-4xl font-bold">Privacy Policy</div>
        <div className="grid text-muted-foreground text-md gap-6">
          <p>
            <span className="font-bold">Last Update:</span> 22 August 2024.
          </p>
          <p>
            Welcome to <span className="font-bold">Nisab Today.</span> This
            Privacy Policy outlines how we handle the personal information of
            visitors to our website.
          </p>
          <div className="text-xl font-bold">
            1. Collection of Personal Data
          </div>
          <p>
            Nisab Today does not collect, store, or use any personally
            identifiable information (PII) from visitors to our website. We do
            not collect information such as names, email addresses, IP
            addresses, or any other data that could be used to identify a user.
          </p>
          <div className="text-xl font-bold">
            2. Use of Cookies and Similar Technologies
          </div>
          <p>
            Nisab Today does not use cookies or other tracking technologies to
            collect information about users. As such, there is no cookie consent
            banner present, as no cookies are employed.
          </p>
          <div className="text-xl font-bold">
            3. Sharing of Data with Third Parties
          </div>
          <p>
            Since we do not collect any personal data, Nisab Today does not
            share any information with third parties.
          </p>
          <div className="text-xl font-bold">4. Security</div>
          <p>
            Although we do not collect personal data, we are committed to
            maintaining high security standards to protect the integrity of our
            website and prevent any unauthorized access or malicious activity.
          </p>
          <div className="text-xl font-bold">
            5. International Data Transfers
          </div>
          <p>
            As no personal data is collected, there is no transfer of data to
            countries outside the European Economic Area (EEA) or to other
            countries.
          </p>
          <div className="text-xl font-bold">6. User Rights</div>
          <p>
            Since no personal data is collected on Nisab Today, users do not
            need to exercise rights of access, rectification, deletion, or data
            portability. However, we are available to address any questions or
            concerns.
          </p>
          <div className="text-xl font-bold">7. Contact Information</div>
          <p>
            For any questions, requests, or complaints regarding this Privacy
            Policy, you can contact us at{" "}
            <Link
              href="mailto:info@dattero.org"
              className="text-blue-700 underline"
            >
              info@dattero.org
            </Link>
            .
          </p>
          <div className="text-xl font-bold">
            8. Changes to the Privacy Policy
          </div>
          <p>
            No updates to this Privacy Policy are planned in the near future.
            However, should any changes occur, users will be notified through a
            prominent notice on our website.
          </p>
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
};

export default page;
