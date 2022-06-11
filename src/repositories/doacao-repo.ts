import { auth, db, storage } from "@/firebase";
import { uuid } from "@/helpers/uuid";
import type { Doacao } from "@/models/doacao";
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "@firebase/storage";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { onUnmounted, ref } from "vue";
import moment from "moment";

const doacaoCollectionRef = collection(db, "doacao");

export const useDoacaoRepo = () => ({
  async uploadFoto(file: Blob | Uint8Array | ArrayBuffer) {
    const fotoId = uuid();
    const fotoRef = storageRef(storage, "doacao/" + fotoId + ".jpg");

    try {
      const result = await uploadBytes(fotoRef, file);
      return result.ref.fullPath;
    } catch {
      alert("Ocorreu um erro ao enviar a foto.");
      return null;
    }
  },

  async getFotoLink(path: string) {
    const fotoRef = storageRef(storage, path);
    return await getDownloadURL(fotoRef);
  },

  async createDoacao(doacao: Doacao) {
    doacao.idDoador = auth.currentUser?.uid;

    if (doacao.idDoador) {
      return await addDoc(doacaoCollectionRef, doacao);
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  async setDoacaoEntregue(doacao: Doacao) {
    const docRef = doc(doacaoCollectionRef, doacao.id);
    doacao.entregue = true;
    setDoc(docRef, doacao);
  },

  async setDoacaoCancelada(doacao: Doacao, motivo: string) {
    const docRef = doc(doacaoCollectionRef, doacao.id);
    doacao.cancelamento = motivo;
    setDoc(docRef, doacao);
  },

  async setDoacaoSolicitada(doacao: Doacao) {
    doacao.idConsumidor = auth.currentUser?.uid || null;

    if (doacao.idConsumidor) {
      const docRef = doc(doacaoCollectionRef, doacao.id);
      setDoc(docRef, doacao);
    } else {
      throw Error("Usuário não autenticado.");
    }
  },

  useDoacoesDisponiveis() {
    const doacoes = ref<Doacao[]>([]);
    const q = query(
      doacaoCollectionRef,
      where("idConsumidor", "==", null),
      where("cancelamento", "==", null),
      orderBy("dataDoacao", "desc")
    );
    const close = onSnapshot(q, (snapshot) => {
      doacoes.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Doacao),
          dataDoacao: doc.data().dataDoacao.toDate(),
        }))
        .filter((doacao) => {
          const validade = moment(
            `${doacao.validade} 23:59`,
            "DD/MM/YYYY HH:mm"
          );
          return validade.diff(moment()) >= 0;
        });
    });
    onUnmounted(close);
    return doacoes;
  },

  useMinhasDoacoes() {
    const userId = auth.currentUser?.uid;
    const doacoes = ref<Doacao[]>([]);
    const q = query(
      doacaoCollectionRef,
      where("idDoador", "==", userId),
      orderBy("dataDoacao", "desc")
    );
    const close = onSnapshot(q, (snapshot) => {
      doacoes.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Doacao),
        dataDoacao: doc.data().dataDoacao.toDate(),
      }));
    });
    onUnmounted(close);
    return doacoes;
  },

  useDoacoesRecebidas() {
    const userId = auth.currentUser?.uid;
    const doacoes = ref<Doacao[]>([]);
    const q = query(
      doacaoCollectionRef,
      where("idConsumidor", "==", userId),
      orderBy("dataDoacao", "desc")
    );
    const close = onSnapshot(q, (snapshot) => {
      doacoes.value = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Doacao),
          dataDoacao: doc.data().dataDoacao.toDate(),
        }))
        .filter((doacao) => doacao.idConsumidor == userId);
    });
    onUnmounted(close);
    return doacoes;
  },
});
