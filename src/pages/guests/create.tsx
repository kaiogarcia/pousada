import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../../components/Form/Input";
import PageContainer from "../../components/PageContainer";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../services/queryClient";
import { GuestFormData } from "../../types/guestTypes";
import { createGuest } from "../../services/hooks/useGuests";
import { createGuestFormSchema } from "../../utils/guestUtils";
import { toast } from "react-toastify";

function CreateGuest() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormData>({
    resolver: yupResolver(createGuestFormSchema),
  });

  const createGuestMutation = useMutation(createGuest, {
    onSuccess: () => {
      queryClient.invalidateQueries(["guests"]);
    },
  });

  const handleCreateNewGuest: SubmitHandler<GuestFormData> = async (values) => {
    await createGuestMutation.mutateAsync(values);
    toast.success("Usuário criado com sucesso !");
    router.push("/guests");
  };

  return (
    <PageContainer>
      <Box as="form" onSubmit={handleSubmit(handleCreateNewGuest)}>
        <Heading size="lg" fontWeight="normal">
          Novo hóspede
        </Heading>
        <Divider my={6} borderColor="gray.700" />
        <SimpleGrid columns={2} spacing={8} w="100%">
          <Input label="Nome" {...register("name")} error={errors.name} />
          <Input label="RG" {...register("rg")} error={errors.rg} />
          <Input label="CPF" {...register("cpf")} error={errors.cpf} />
          <Input
            label="Telefone"
            {...register("phoneNumber")}
            error={errors.phoneNumber}
          />
          <Input
            label="Data de Nascimento"
            type="date"
            {...register("birthDate")}
            error={errors.birthDate}
          />
        </SimpleGrid>
        <Flex mt={8} justify="flex-end">
          <HStack spacing={4}>
            <Link href="/guests" passHref>
              <Button as="a" colorScheme="whiteAlpha">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              size="md"
              fontSize="md"
              bg="yellow.600"
              borderColor="yellow.600"
              color="gray.50"
              _hover={{
                bg: "yellow.800",
                borderColor: "yellow.800",
              }}
              isLoading={isSubmitting}
            >
              Salvar
            </Button>
          </HStack>
        </Flex>
      </Box>
    </PageContainer>
  );
}

export default CreateGuest;
