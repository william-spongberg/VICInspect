import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl m-8">
      <div className="flex justify-center">
        <h1 className={title({ size: "lg", color: "blue" })}>Privacy Policy</h1>
      </div>

      <p className={subtitle({})}>
        Transit Eye is committed to providing quality services to you,
        and this policy outlines our ongoing obligations to you in respect of
        how we manage your Personal Information.
      </p>

      <p className={subtitle({})}>
        We have adopted the Australian Privacy Principles (APPs) contained in
        the Privacy Act 1988 (Cth) (the Privacy Act). The APPs govern the way in
        which we collect, use, disclose, store, secure, and dispose of your
        Personal Information.
      </p>

      <p className={subtitle({})}>
        A copy of the Australian Privacy Principles may be obtained from the
        website of The Office of the Australian Information Commissioner at{" "}
        <a
          className="text-blue-600 hover:underline"
          href="https://www.oaic.gov.au/"
        >
          https://www.oaic.gov.au/
        </a>
        .
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        What is Personal Information and why do we collect it?
      </h2>

      <p className={subtitle({})}>
        Personal Information is information or an opinion that identifies an
        individual. Examples of Personal Information we collect include names
        and email addresses.
      </p>

      <p className={subtitle({})}>
        This Personal Information is obtained in the following ways:
      </p>

      <ul className="list-disc pl-10 my-4">
        <li className="text-default-600 mb-2">
          When you sign up or log in using Facebook or GitHub authentication.
        </li>
        <li className="text-default-600 mb-2">
          When you voluntarily submit information about PTV inspector locations.
        </li>
        <li className="text-default-600 mb-2">
          Through cookies and analytics tools on our website.
        </li>
      </ul>

      <p className={subtitle({})}>
        We collect your Personal Information for the primary purpose of
        providing our service to you. This includes allowing users to report and
        view PTV inspector locations. We do not use your Personal Information
        for marketing purposes.
      </p>

      <p className={subtitle({})}>
        When we collect Personal Information, we will, where appropriate and
        possible, explain to you why we are collecting the information and how
        we plan to use it.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        Sensitive Information
      </h2>

      <p className={subtitle({})}>
        Sensitive information is defined in the Privacy Act to include
        information or opinions about matters such as an individual&apos;s
        racial or ethnic origin, political opinions, religious beliefs, or
        criminal record.
      </p>

      <p className={subtitle({})}>
        We do not intentionally collect sensitive information. However, if any
        such information is provided to us, it will be used only:
      </p>

      <ul className="list-disc pl-10 my-4">
        <li className="text-default-600 mb-2">
          For the primary purpose for which it was obtained,
        </li>
        <li className="text-default-600 mb-2">
          For a secondary purpose that is directly related to the primary
          purpose,
        </li>
        <li className="text-default-600 mb-2">With your consent, or</li>
        <li className="text-default-600 mb-2">
          Where required or authorised by law.
        </li>
      </ul>

      <h2 className={title({ size: "sm", color: "cyan" })}>Third Parties</h2>

      <p className={subtitle({})}>
        Where reasonable and practicable to do so, we will collect your Personal
        Information only from you. However, in some circumstances, we may
        receive information from third-party authentication services (e.g.,
        Facebook login). In such cases, we will take reasonable steps to ensure
        you are made aware of the information provided to us by the third party.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        Disclosure of Personal Information
      </h2>

      <p className={subtitle({})}>
        Your Personal Information may be disclosed in the following
        circumstances:
      </p>

      <ul className="list-disc pl-10 my-4">
        <li className="text-default-600 mb-2">
          To third parties where you consent to the use or disclosure; and
        </li>
        <li className="text-default-600 mb-2">
          Where required or authorised by law.
        </li>
      </ul>

      <p className={subtitle({})}>
        We do not sell or share your Personal Information with advertisers or
        other third parties for marketing purposes.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        Security of Personal Information
      </h2>

      <p className={subtitle({})}>
        Your Personal Information is stored in a manner that reasonably protects
        it from misuse, loss, and unauthorised access, modification, or
        disclosure.
      </p>

      <p className={subtitle({})}>
        When your Personal Information is no longer needed for the purpose for
        which it was obtained, we will take reasonable steps to securely delete
        or de-identify your Personal Information.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        Access to Your Personal Information
      </h2>

      <p className={subtitle({})}>
        You may access the Personal Information we hold about you and request
        updates or corrections, subject to certain exceptions. If you wish to
        access your Personal Information, please contact us in writing.
      </p>

      <p className={subtitle({})}>
        Transit Eye will not charge any fee for your access request,
        but we may charge an administrative fee for providing a copy of your
        Personal Information.
      </p>

      <p className={subtitle({})}>
        To protect your Personal Information, we may require identification from
        you before releasing the requested information.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        Maintaining the Quality of Your Personal Information
      </h2>

      <p className={subtitle({})}>
        It is important to us that your Personal Information is accurate,
        complete, and up to date. If you find that the information we have is
        not accurate, please advise us as soon as practicable so we can update
        our records.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>Policy Updates</h2>

      <p className={subtitle({})}>
        This Policy may change from time to time and will be updated on our
        website.
      </p>

      <h2 className={title({ size: "sm", color: "cyan" })}>
        Privacy Policy Complaints and Enquiries
      </h2>

      <p className={subtitle({})}>
        If you have any queries or complaints about our Privacy Policy, please
        contact us at:
      </p>

      <Link
        className="text-xl"
        href="mailto:william@spongberg.dev"
        title="privacy policy contact"
      >
        <span className="text-default-600">Email:</span>
        <p className="text-primary">william@spongberg.dev</p>
      </Link>
    </div>
  );
}
