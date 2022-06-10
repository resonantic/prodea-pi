<script setup lang="ts">
import type { UserInfo } from "@/models/user-info";
import { useAuthStore } from "@/stores";
import { computed, reactive } from "@vue/reactivity";
import { ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const $auth = useAuthStore();

const password = ref<string>("");
const userInfo = reactive<UserInfo>({
  email: "",
  cnpj: "",
  nome: "",
  endereco: "",
  cidade: "",
  telefone: "",
  sobre: "",
  nomeResponsavel: "",
  cpfResponsavel: "",
  doador: false,
  consumidor: false,
  admin: false,
  status: 0,
});

const canSubmit = computed(
  () =>
    password.value != "" &&
    userInfo.email != "" &&
    userInfo.cnpj != "" &&
    userInfo.nome != "" &&
    userInfo.endereco != "" &&
    userInfo.cidade != "" &&
    userInfo.telefone != "" &&
    userInfo.sobre != "" &&
    userInfo.nomeResponsavel != "" &&
    userInfo.cpfResponsavel != "" &&
    (userInfo.consumidor || userInfo.doador)
);

const onSubmit = async () => {
  const result = await $auth.register(userInfo.email, password.value, userInfo);
  if (result) {
    $router.push("/_");
  }
};
</script>

<template>
  <main class="mt-5 container">
    <h1>Solicitar Cadastro</h1>
    <p class="lead">
      Para solicitar o cadastro de sua empresa/entidade é fácil, insira todas as
      informações solicitadas abaixo:
    </p>
    <form @submit.prevent="onSubmit">
      <div class="row">
        <div class="mb-3 col-md-6">
          <label for="emailInput" class="form-label">Email</label>
          <input
            type="email"
            v-model="userInfo.email"
            class="form-control"
            id="emailInput"
          />
        </div>
        <div class="mb-3 col-md-6">
          <label for="passwordInput" class="form-label">Senha</label>
          <input
            type="password"
            v-model="password"
            class="form-control"
            id="passwordInput"
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
          />
        </div>
        <div class="mb-3 col-md-7">
          <label for="nomeInput" class="form-label">
            Nome da Empresa/Entidade
          </label>
          <input
            type="text"
            v-model="userInfo.nome"
            class="form-control"
            id="nomeInput"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-6">
          <label for="enderecoInput" class="form-label">
            Endereço (Rua, Número e Bairro)
          </label>
          <input
            type="text"
            v-model="userInfo.endereco"
            class="form-control"
            id="enderecoInput"
          />
        </div>
        <div class="mb-3 col-md-3">
          <label for="cidadeInput" class="form-label"> Cidade </label>
          <input
            type="text"
            v-model="userInfo.cidade"
            class="form-control"
            id="cidadeInput"
          />
        </div>
        <div class="mb-3 col-md-3">
          <label for="telefoneInput" class="form-label"> Telefone </label>
          <input
            type="text"
            v-model="userInfo.telefone"
            class="form-control"
            id="telefoneInput"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="sobreInput" class="form-label">
            Sobre a Empresa/Entidade
          </label>
          <textarea
            v-model="userInfo.sobre"
            class="form-control"
            id="sobreInput"
            placeholder="Conte-nos um pouco sobre sua empresa/entidade..."
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-7">
          <label for="cpfResponsavelInput" class="form-label">
            Nome Completo do Responsável
          </label>
          <input
            type="text"
            v-model="userInfo.cpfResponsavel"
            class="form-control"
            id="cpfResponsavelInput"
          />
        </div>
        <div class="mb-3 col-md-5">
          <label for="nomeResponsavelInput" class="form-label">
            CPF do Responsável
          </label>
          <input
            type="text"
            v-model="userInfo.nomeResponsavel"
            class="form-control"
            id="nomeResponsavelInput"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3 col-md-12">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              v-model="userInfo.doador"
              id="doadorCheckbox"
            />
            <label class="form-check-label" for="doadorCheckbox">
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
              v-model="userInfo.consumidor"
              id="consumidorCheckbox"
            />
            <label class="form-check-label" for="consumidorCheckbox">
              Desejo cadastrar minha empresa/entidade como consumidora.
            </label>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary" :disabled="!canSubmit">
        Solicitar Cadastro
      </button>

      &nbsp;

      <router-link to="/" class="btn btn-secondary"> Voltar </router-link>
    </form>
  </main>
</template>

<style scoped>
.lead {
  text-align: justify;
  text-justify: inter-word;
}
</style>
