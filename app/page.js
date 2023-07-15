"use client";
import Image from "next/image";
import Link from "next/link";
// import Head from "next/head";
import { Container, Center, VStack, Heading } from "@chakra-ui/react";

import bbq from "../assets/img/bbq.svg";

export default function Home() {
  return (
    <Container h="100vh">
      <Center h="100vh">
        <VStack>
          <Center>
            <Heading>Pocket Pantry</Heading>
          </Center>
          <Center>A simple recipe organizer</Center>
          <br />
          <Center>
            <Image src={bbq.src} height={200} width={200} alt="Cook Barbeque" />
          </Center>
          <br />
          <Center>
            <small>Coming Soon</small>
          </Center>
          <br />
          <Center>
            Made by
            <Link href="https://satshree.com.np" style={{ marginLeft: "5px" }}>
              Satshree Shrestha
            </Link>
          </Center>
        </VStack>
      </Center>
    </Container>
  );
}
