<script setup lang="ts"></script>

<template>
  <main>
    <div class="container py-4">
      <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
          <h1 class="display-5 fw-bold">Programa de Doação de Alimentos</h1>
          <p class="col-md-8 fs-4">
            O PRODEA é um programa que se baseia na Lei nº 14.016, de 23 de
            Junho de 2020, e tem como objetivo facilitar a doação de alimentos a
            entidades beneficentes.
          </p>
          <router-link
            to="cadastro"
            class="btn btn-primary btn-lg"
            type="button"
          >
            Solicitar Cadastro
          </router-link>
          &nbsp;
          <router-link
            to="login"
            class="btn btn-secondary btn-lg"
            type="button"
          >
            Acessar Plataforma
          </router-link>
        </div>
      </div>

      <div class="row align-items-md-stretch">
        <div class="col-md-4">
          <div class="h-100 p-5 bg-light border rounded-3">
            <h2>Conheça a Lei</h2>
            <p>Ainda não conhece a Lei nº 14.016/2020?</p>
            <a
              class="btn btn-outline-secondary"
              href="https://www.in.gov.br/web/dou/-/lei-n-14.016-de-23-de-junho-de-2020-263187111"
              target="_blank"
              type="button"
            >
              Saiba mais
            </a>
          </div>
        </div>

        <div class="col-md-4">
          <div class="h-100 p-5 bg-light border rounded-3">
            <h2>Conheça o Projeto</h2>
            <p>O que é o PRODEA?</p>
            <router-link
              to="prodea"
              class="btn btn-outline-secondary"
              type="button"
            >
              Saiba mais
            </router-link>
          </div>
        </div>

        <div class="col-md-4">
          <div class="h-100 p-5 bg-light border rounded-3">
            <h2>Participantes</h2>
            <p>Conheça os participantes do projeto.</p>
            <router-link
              to="participantes"
              class="btn btn-outline-secondary"
              type="button"
            >
              Saiba mais
            </router-link>
          </div>
        </div>
      </div>

      <footer class="pt-3 mt-4 text-muted border-top">
        &copy; 2022 - Projeto Integrador em Computação II (UNIVESP) - Turma 007
        - Grupo 054
      </footer>
    </div>
  </main>
</template>
