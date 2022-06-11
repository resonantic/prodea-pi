<script setup lang="ts">
import type { Doacao } from "@/models/doacao";
import { useDoacaoRepo } from "@/repositories/doacao-repo";
import { useUserInfoRepo } from "@/repositories/user-info-repo";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const $router = useRouter();
const $userInfoRepo = useUserInfoRepo();
const $doacaoRepo = useDoacaoRepo();

const consumidores = $userInfoRepo.useConsumersInfo();

const fotoBlob = ref<Blob | null>(null);
const doacao = reactive<Doacao>({
  descricao: "",
  linkFoto: null,
  idConsumidor: null,
  validade: "",
});

const fotoChanged = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.item(0);
  if (file) {
    const bytes = await file.arrayBuffer();
    const arrayBufferView = new Uint8Array(bytes);
    const blob = new Blob([arrayBufferView], { type: "image/jpeg" });
    fotoBlob.value = blob;
  } else {
    fotoBlob.value = null;
  }
};

const onSubmit = async () => {
  if (fotoBlob.value) {
    doacao.linkFoto = await $doacaoRepo.uploadFoto(fotoBlob.value);
  }
  doacao.dataDoacao = new Date();
  const result = await $doacaoRepo.createDoacao(doacao);
  if (result) {
    alert("Doação postada com sucesso.");
    $router.push("/_/minhas-doacoes");
  }
};
</script>

<template>
  <div>
    <h3 class="pb-3">Doar</h3>
    <form @submit.prevent="onSubmit">
      <div class="row">
        <div class="mb-3">
          <label for="descricaoInput" class="form-label"> Descrição </label>
          <textarea
            v-model="doacao.descricao"
            class="form-control"
            id="descricaoInput"
            placeholder="Descreva as condições do produto que será doado..."
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="fotoInput" class="form-label">Foto</label>
          <input
            class="form-control"
            type="file"
            id="fotoInput"
            @change="fotoChanged"
            accept="image/jpeg"
          />
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="consumidorSelect" class="form-label">
            Doar para uma entidade específica? Caso não seja selecionada nenhuma
            entidade específica, a doação ficará disponível para qualquer
            entidade cadastrada na plataforma.
          </label>
          <select
            v-model="doacao.idConsumidor"
            class="form-select"
            id="consumidorSelect"
          >
            <option :value="null">Não</option>
            <option
              v-for="consumidor in consumidores"
              :key="consumidor.id"
              :value="consumidor.id"
            >
              {{ consumidor.nome }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="mb-3">
          <label for="validadeInput" class="form-label">
            Prazo de Validade da Doação
          </label>
          <input
            type="text"
            v-model="doacao.validade"
            class="form-control"
            id="validadeInput"
            v-maska="'##/##/####'"
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Postar Doação</button>
    </form>
  </div>
</template>
