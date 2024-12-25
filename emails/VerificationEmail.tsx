import { Button, Head, Heading, Html, Preview, Row, Section, Text} from "@react-email/components";

interface VerificationEmailProps {
    username : string;
    otp : string;
}


export default function VerificationEmail({username,otp}:VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
        <Head>
            <title>Verification Code</title>
        </Head>
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <Section>
            <Row>
                <Heading as='h2'>
                    Hello {username},
                </Heading>
            </Row>
            <Row>
                <Text>
                    Thank you for registering. Please use the following
                    verification code to complete your registration:
                </Text>
            </Row>
            <Row>
                <Text>{otp}</Text>
            </Row>
            <Row>
                <Text>
                    If you did not request this code, please ignore this email.
                </Text>
            </Row>
            {/* <Row>
                <Button href={`http://localhost:3000/verify/${username}`} style={{color:'#61dafb'}}>
                    Verify here
                </Button>
            </Row> */}
        </Section>
    </Html>
  )
}
