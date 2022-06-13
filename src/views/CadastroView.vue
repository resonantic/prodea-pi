<script setup lang="ts">
import type { UserInfo } from "@/models/user-info";
import { useAuthStore } from "@/stores/auth-store";
import { computed, reactive } from "@vue/reactivity";
import { ref } from "vue";
import { useRouter } from "vue-router";
import citiesJson from "@/assets/cities.json";
import { orderBy } from "lodash";
import { useLoadingStore } from "@/stores/loading-store";

const $router = useRouter();
const $auth = useAuthStore();
const $loading = useLoadingStore();

const cities = orderBy(citiesJson, "nome");

const password = ref<string>("");
const userInfo = reactive<UserInfo>({
  email: "",
  cnpj: "",
  name: "",
  address: "",
  city: "",
  phoneNumber: "",
  about: "",
  responsibleName: "",
  responsibleCpf: "",
  isDonor: false,
  isBeneficiary: false,
  isAdmin: false,
  status: 0,
});

const canSubmit = computed(
  () =>
    password.value != "" &&
    userInfo.email != "" &&
    userInfo.cnpj != "" &&
    userInfo.name != "" &&
    userInfo.address != "" &&
    userInfo.city != "" &&
    userInfo.phoneNumber != "" &&
    userInfo.about != "" &&
    userInfo.responsibleName != "" &&
    userInfo.responsibleCpf != "" &&
    (userInfo.isBeneficiary || userInfo.isDonor)
);

const onSubmit = async () => {
  $loading.startLoading();
  const result = await $auth.register(userInfo.email, password.value, userInfo);
  if (result) {
    await $router.push("/_");
  }
  $loading.stopLoading();
};
</script>

<template>
  <main class="mt-5 container">
    <h1>Solicitar Cadastro</h1>
    <p class="lead">
      Para solicitar o cadastro de sua empresa/entidade é fácil, insira todas as
      informações solicitadas abaixo:
    </p>
    <form @submit.prevent="onSubmit" autocomplete="off">
      <div class="row">
        <div class="mb-3 col-md-6">
          <label for="emailInput" class="form-label"> Email </label>
          <input
            type="email"
            v-model="userInfo.email"
            class="form-control"
            id="emailInput"
            autocomplete="off"
          />
        </div>
        <div class="mb-3 col-md-6">
          <label for="passwordInput" class="form-label"> Senha </label>
          <input
            type="password"
            v-model="password"
            class="form-control"
            id="passwordInput"
            autocomplete="new-password"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-5">
          <label for="cnpjInput" class="form-label">CNPJ</label>
          <input
            type="text"
            v-model="userInfo.cnpj"
            class="form-control"
            id="cnpjInput"
            v-maska="'##.###.###/####-##'"
          />
        </div>
        <div class="mb-3 col-md-7">
          <label for="nameInput" class="form-label">
            Nome da Empresa/Entidade
          </label>
          <input
            type="text"
            v-model="userInfo.name"
            class="form-control"
            id="nameInput"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-6">
          <label for="addressInput" class="form-label">
            Endereço (Rua, Número e Bairro)
          </label>
          <input
            type="text"
            v-model="userInfo.address"
            class="form-control"
            id="addressInput"
          />
        </div>
        <div class="mb-3 col-md-3">
          <label for="citySelect" class="form-label"> Cidade </label>
          <select v-model="userInfo.city" class="form-select" id="citySelect">
            <option
              v-for="city in cities"
              :key="city.nome"
              :value="city.nome + '/' + city.uf"
            >
              {{ city.nome }}/{{ city.uf }}
            </option>
          </select>
        </div>
        <div class="mb-3 col-md-3">
          <label for="phoneNumberInput" class="form-label"> Telefone </label>
          <input
            type="text"
            v-model="userInfo.phoneNumber"
            class="form-control"
            id="phoneNumberInput"
            v-maska="['(##) ####-####', '(##) #####-####']"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="aboutInput" class="form-label">
            Sobre a Empresa/Entidade
          </label>
          <textarea
            v-model="userInfo.about"
            class="form-control"
            id="aboutInput"
            placeholder="Conte-nos um pouco sobre sua empresa/entidade..."
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-7">
          <label for="responsibleNameInput" class="form-label">
            Nome Completo do Responsável
          </label>
          <input
            type="text"
            v-model="userInfo.responsibleName"
            class="form-control"
            id="responsibleNameInput"
          />
        </div>
        <div class="mb-3 col-md-5">
          <label for="responsibleCpfInput" class="form-label">
            CPF do Responsável
          </label>
          <input
            type="text"
            v-model="userInfo.responsibleCpf"
            class="form-control"
            id="responsibleCpfInput"
            v-maska="'###.###.###-##'"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-12">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="userInfo.isDonor"
              id="isDonorCheckbox"
            />
            <label class="form-check-label" for="isDonorCheckbox">
              Desejo cadastrar minha empresa/entidade como doadora.
            </label>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-12">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="userInfo.isBeneficiary"
              id="isBeneficiaryCheckbox"
            />
            <label class="form-check-label" for="isBeneficiaryCheckbox">
              Desejo cadastrar minha empresa/entidade como beneficiária.
            </label>
          </div>
        </div>
      </div>

      <div class="d-grid gap-2 d-md-block mb-3">
        <button
          type="submit"
          class="btn btn-primary me-md-2"
          :disabled="!canSubmit"
        >
          Solicitar Cadastro
        </button>
        <router-link to="/" class="btn btn-secondary"> Voltar </router-link>
      </div>
    </form>
  </main>
</template>

<style scoped>
.lead {
  text-align: justify;
  text-justify: inter-word;
}
</style>
